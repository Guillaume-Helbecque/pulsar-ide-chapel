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
    return super.spawn(
      // Name of the language server's executable.
      "chpl-language-server",
      // Any other arguments that the server expects.
      ['--chplcheck'],
      // Options to pass to the `spawn` command. Most language servers
      // expect that they can treat the working directory as the project root.
      { cwd: projectPath }
    );
  }
}

module.exports = new ChapelLanguageClient();
