const defaultKeyMap = {
    '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': '', '0': '',
    'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '',
    'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '',
    'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': ''
};

let keyMap = JSON.parse(localStorage.getItem('keyMap')) || defaultKeyMap;
let isEditModalOpen = false;

const keyboardLayout = [
    '1234567890',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
];

function parseLinks(linkString) {
    const links = linkString.split(',').map(link => "https://" + link.trim().replace(/^(https?:\/\/)?(www\.)?/i, ''));
    return links.map(link => {
        const match = link.match(/^(.*?)(?:\[(.*?)\])?$/);
        return {
            url: match[1],
            favicon: match[2] || null
        };
    });
}

function createKeyboard() {
    const keyboardElement = document.getElementById('keyboard');
    keyboardElement.innerHTML = '';
    keyboardLayout.forEach((row, rowIndex) => {
        const rowElement = document.createElement('div');
        rowElement.className = `keyboard-row row-${rowIndex + 1}`;

        row.split('').forEach(letter => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';

            const letterSpan = document.createElement('span');
            letterSpan.className = 'key-letter';
            letterSpan.textContent = letter;
            keyElement.appendChild(letterSpan);

            if (keyMap[letter]) {
                const links = parseLinks(keyMap[letter]);
                if (links.length > 1) {
                    const folderIcon = document.createElement('img');
                    folderIcon.className = 'favicon folder-icon';
                    folderIcon.src = 'folder.png';
                    folderIcon.alt = 'Folder';
                    keyElement.appendChild(folderIcon);

                    const faviconContainer = document.createElement('div');
                    faviconContainer.className = 'favicon-container';
                    links.slice(0, 4).forEach(link => {
                        const faviconImg = document.createElement('img');
                        faviconImg.className = 'mini-favicon';
                        faviconImg.src = link.favicon || `https://www.google.com/s2/favicons?domain=${link.url}&sz=16`;
                        faviconImg.alt = `Favicon for ${link.url}`;
                        faviconContainer.appendChild(faviconImg);
                    });
                    keyElement.appendChild(faviconContainer);
                } else if (links.length === 1) {
                    const faviconImg = document.createElement('img');
                    faviconImg.className = 'favicon';
                    faviconImg.src = links[0].favicon || `https://www.google.com/s2/favicons?domain=${links[0].url}&sz=64`;
                    faviconImg.alt = `Favicon for ${links[0].url}`;
                    keyElement.appendChild(faviconImg);
                }

                keyElement.addEventListener('click', () => {
                    openLinks(links.map(link => link.url));
                });
            }

            rowElement.appendChild(keyElement);
        });

        keyboardElement.appendChild(rowElement);
    });
}

function openLinks(links) {
    if (links.length > 0) {
        for (let i = 1; i < links.length; i++) {
            window.open(links[i], '_blank');
        }
        window.location.href = links[0];
    }
}

function handleKeyPress(event) {
    if (isEditModalOpen || event.metaKey || event.ctrlKey) return;
    const key = event.key.toLowerCase();
    if (key in keyMap && keyMap[key]) {
        const links = keyMap[key].split(',').map(url => url.trim());
        openLinks(links);
    }
}

function showEditModal() {
    const modal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    editForm.innerHTML = '';

    for (const [key, value] of Object.entries(keyMap)) {
        const label = document.createElement('label');
        label.textContent = key.toUpperCase();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.id = `edit-${key}`;
        editForm.appendChild(label);
        editForm.appendChild(input);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    isEditModalOpen = true;
}

function hideEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    isEditModalOpen = false;
}

function saveLinks() {
    for (const key of Object.keys(keyMap)) {
        const input = document.getElementById(`edit-${key}`);
        keyMap[key] = input.value;
    }
    localStorage.setItem('keyMap', JSON.stringify(keyMap));
    hideEditModal();
    createKeyboard();
}

document.addEventListener('DOMContentLoaded', () => {
    createKeyboard();
    document.addEventListener('keydown', handleKeyPress);
    document.getElementById('editButton').addEventListener('click', showEditModal);
    document.getElementById('saveButton').addEventListener('click', saveLinks);
    document.getElementById('cancelButton').addEventListener('click', hideEditModal);
});