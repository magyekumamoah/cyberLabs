function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  }
  
  window.onload = () => showTab('linux');
  
  function handleTerminalInput(event) {
    if (event.key === 'Enter') {
      const input = event.target;
      const command = input.value.trim();
      const output = document.getElementById('terminal-output');
  
      const fileSystem = handleTerminalInput.fileSystem || {
        '/home/student': ['notes.txt', 'projects'],
        '/home/student/projects': ['cli.sh']
      };
      handleTerminalInput.fileSystem = fileSystem;
  
      let currentDir = handleTerminalInput.currentDir || '/home/student';
      let result = '';
  
      const cd = (arg) => {
        if (arg === '..') {
          const parts = currentDir.split('/');
          parts.pop();
          currentDir = parts.length > 1 ? parts.join('/') : '/';
        } else {
          const newPath = currentDir + '/' + arg;
          if (fileSystem[newPath]) currentDir = newPath;
          else result = `bash: cd: ${arg}: No such file or directory`;
        }
      };
  
      const ls = () => {
        const contents = fileSystem[currentDir] || [];
        result = contents.join('  ');
      };
  
      switch (true) {
        case command === 'help':
          result = 'Supported commands: help, echo, clear, pwd, whoami, ls, cd, mkdir, touch, cat, nano, rm';
          break;
        case command === 'pwd':
          result = currentDir;
          break;
        case command === 'whoami':
          result = 'student';
          break;
        case command === 'clear':
          output.innerText = '';
          input.value = '';
          return;
        case command === 'ls':
          ls();
          break;
        case command.startsWith('cd '):
          cd(command.split(' ')[1]);
          break;
        case command.startsWith('mkdir '): {
          const dirName = command.split(' ')[1];
          const newPath = currentDir + '/' + dirName;
          if (!fileSystem[newPath]) {
            fileSystem[newPath] = [];
            fileSystem[currentDir].push(dirName);
            result = '';
          } else {
            result = `mkdir: cannot create directory ‘${dirName}’: File exists`;
          }
          break;
        }
        case command.startsWith('touch '): {
          const fileName = command.split(' ')[1];
          if (!fileSystem[currentDir].includes(fileName)) {
            fileSystem[currentDir].push(fileName);
            result = '';
          }
          break;
        }
        case command.startsWith('echo '): {
          if (command.includes('>')) {
            const [left, right] = command.split('>');
            const content = left.trim().slice(5);
            const fileName = right.trim();
            const path = currentDir;
            if (!fileSystem[path].includes(fileName)) {
              fileSystem[path].push(fileName);
            }
            const contentMap = handleTerminalInput.fileContentMap || {};
            contentMap[path + '/' + fileName] = content;
            handleTerminalInput.fileContentMap = contentMap;
            result = '';
          } else {
            result = command.slice(5);
          }
          break;
        }
        case command.startsWith('cat '): {
          const fileName = command.split(' ')[1];
          const path = currentDir + '/' + fileName;
          const contentMap = handleTerminalInput.fileContentMap || {};
          result = fileSystem[currentDir].includes(fileName)
            ? (contentMap[path] || '')
            : `cat: ${fileName}: No such file`;
          break;
        }
        case command.startsWith('nano '): {
          const fileName = command.split(' ')[1];
          const path = currentDir + '/' + fileName;
          const content = prompt(`Opening ${fileName} in nano. Enter new content:`);
          if (content !== null) {
            const contentMap = handleTerminalInput.fileContentMap || {};
            contentMap[path] = content;
            handleTerminalInput.fileContentMap = contentMap;
            if (!fileSystem[currentDir].includes(fileName)) {
              fileSystem[currentDir].push(fileName);
            }
            result = `File '${fileName}' saved.`;
          } else {
            result = 'Editing cancelled.';
          }
          break;
        }
        case command.startsWith('rm '): {
          const fileName = command.split(' ')[1];
          const path = currentDir + '/' + fileName;
          if (fileSystem[currentDir].includes(fileName)) {
            fileSystem[currentDir] = fileSystem[currentDir].filter(item => item !== fileName);
            const contentMap = handleTerminalInput.fileContentMap || {};
            delete contentMap[path];
            handleTerminalInput.fileContentMap = contentMap;
            result = '';
          } else {
            result = `rm: cannot remove '${fileName}': No such file`;
          }
          break;
        }
        default:
          result = `Command not found: ${command}`;
      }
  
      handleTerminalInput.currentDir = currentDir;
      output.innerText += `\n$ ${command}\n${result}`;
      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  }
  