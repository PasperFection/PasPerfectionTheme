const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log('PasPerfection theme is now active!');
    try {
        let disposable = vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('pasperfection')) {
                updateTheme();
            }
        });

        context.subscriptions.push(disposable);
        updateTheme(); // Initial update
    } catch (error) {
        console.error('Error activating PasPerfection theme:', error);
        vscode.window.showErrorMessage('Failed to activate PasPerfection theme. Please check the logs for more information.');
    }
}

function updateTheme() {
    const config = vscode.workspace.getConfiguration('pasperfection');
    const enableCustomCursor = config.get('enableCustomCursor');
    const enableLineHighlight = config.get('enableLineHighlight');

    const colorCustomizations = {
        'editorCursor.foreground': enableCustomCursor ? '#FFFFFF' : null,
        'editor.lineHighlightBackground': enableLineHighlight ? '#2A2A2A' : null
    };

    // Remove null values
    Object.keys(colorCustomizations).forEach(key => 
        colorCustomizations[key] === null && delete colorCustomizations[key]
    );

    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizations, vscode.ConfigurationTarget.Global);

    const extensionId = 'pasperfection.pasperfection-theme';
    const extension = vscode.extensions.getExtension(extensionId);

    if (!extension) {
        console.error(`Extension ${extensionId} not found`);
        return;
    }

    const extensionPath = path.dirname(__dirname);
    const darkThemePath = path.join(extensionPath, 'pasperfection-dark-theme.json');
    const lightThemePath = path.join(extensionPath, 'pasperfection-light-theme.json');

    try {
        if (fs.existsSync(darkThemePath) && fs.existsSync(lightThemePath)) {
            console.log('Theme files loaded successfully');
        } else {
            console.error('One or more theme files are missing');
        }
    } catch (err) {
        console.error('Error checking theme files:', err);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
