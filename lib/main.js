const path = require('path');
const { AutoLanguageClient } = require('@savetheclocktower/atom-languageclient');

class ChapelLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    // The root language scope for Chapel files in Pulsar.
    return ["source.chapel"];
  }
  getLanguageName() {
    return "Chapel";
  }
  getServerName() {
    return "Chapel Language Server";
  }
  getPackageName() {
    return "pulsar-ide-chapel";
  }
  startServerProcess (projectPath) {
    // Check whether the Chapel language server is enabled.
    const languageServerEnabled = atom.config.get(
      'pulsar-ide-chapel.enable_chapel_language_server'
    );

    if (!languageServerEnabled) {
      return null;
    }

    // Get CHPL_HOME from the package settings.
    let chplHome = atom.config.get(
      'pulsar-ide-chapel.chapel_home_directory'
    );

    // Get the explicitly configured language server path.
    const configuredPath = atom.config.get(
      'pulsar-ide-chapel.chapel_language_server_path'
    );

    // If CHPL_HOME is not set, try to recover it from the language server path.
    if (!chplHome && configuredPath) {
      chplHome = path.dirname(
        path.dirname(
          path.dirname(configuredPath)
        )
      );
    }

    // Select the language server executable:
    // 1. Use the explicitly configured path if provided.
    // 2. Otherwise, build the path from CHPL_HOME.
    // 3. Otherwise, assume chpl-language-server is in PATH.
    const serverPath =
      configuredPath ||
      (chplHome
        ? path.join(chplHome, 'bin', 'linux64-x86_64', 'chpl-language-server')
        : 'chpl-language-server');

    // Pass CHPL_HOME to the language server environment when available.
    const env = {
      ...process.env,
      ...(chplHome ? { CHPL_HOME: chplHome } : {})
    };

    // Enable chplcheck when requested in the package settings.
    const chplcheckEnabled = atom.config.get(
      'pulsar-ide-chapel.enable_chplcheck'
    );
    const args = chplcheckEnabled ? ['--chplcheck'] : [];

    return super.spawn(
      serverPath,
      // Any other arguments that the server expects.
      args,
      // Options to pass to the `spawn` command. Most language servers
      // expect that they can treat the working directory as the project root.
      {
        cwd: projectPath,
        env
      }
    );
  }
}

module.exports = new ChapelLanguageClient();
