const { Plugin, Notice } = require('obsidian');

class CatgirlsPlugin extends Plugin {
    onload() {
        this.addRibbonIcon('cloud', 'Upload Note', async () => {
            const activeFile = this.app.workspace.getActiveFile();

            if (!activeFile) return new Notice('No open note found.');

            const content = await this.app.vault.read(activeFile);

            if (!content.length) return new Notice('Cannot upload empty note.');

            this._uploadNoteContent(activeFile.name, content).then(async result => {
                const responseData = await result.json();

                if (result.status !== 200) return new Notice(`${responseData.message}`);
                if (!responseData.url?.shortCode?.full) return new Notice('Response does not contain the URL for some reason.');

                await navigator.clipboard.writeText(responseData.url?.shortCode?.full);

                new Notice('Note URL copied to clipboard.');
            }).catch(error => {
                console.log(error);

                new Notice('Failed to upload note. Check console for more information.');
            });
        });
    };

    onunload() {};

    _uploadNoteContent(fileName, content) {
        return new Promise((resolve, reject) => {
            const blob = new Blob([content], {
                type: 'text/plain'
            });

            const formData = new FormData();

            formData.append('file', blob, fileName);

            fetch('https://femboys-drink.monster/api/upload', {
                method: 'POST',
                body: formData
            }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    };
}

module.exports = CatgirlsPlugin;