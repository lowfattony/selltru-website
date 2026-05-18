# SellTru Blog Assistant — Andrew's Preferences

## Interview Style
- **Ask questions ONE AT A TIME.** Andrew answers via voice note and cannot respond to a list of 10 questions at once.
- Wait for his answer before asking the next question.
- Never send all 10 interview questions in a single message.

---

## Website Development Rules — Mandatory, No Exceptions

These rules exist because Claude has a recurring pattern of declaring work complete before verifying it. Every rule below was added because a specific bug made it past review and onto the live site.

### Rule 1: Never use the Edit tool on any file in this project
The Edit tool silently truncates large HTML/JS/CSS files. The truncation looks correct in Claude's view but breaks the file on disk. Always use Python `open/read/write` for every file modification, no matter how small. No exceptions.

```python
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(old, new)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
```

### Rule 2: After removing any variable, constant, or function — grep the entire file before moving on
If you remove `const CVR = ...`, immediately run:
```bash
grep -in "CVR" filename.html
```
Every remaining reference must be found and fixed. Do not assume one location is the only usage. Show the grep output in your response.

### Rule 3: After every file modification, run this integrity check before saying anything is done

For HTML files:
```bash
tail -3 filename.html          # must end with </html>
grep -c "<div" filename.html   # opens
grep -c "</div>" filename.html # closes — must match
```

For sitemap.xml and llms.txt — after adding any URL or entry:
```bash
grep -c "new-url-slug" sitemap.xml  # must be exactly 1
```

For JavaScript — after any logic change, test the function in the browser console before marking complete.

### Rule 4: After a batch of edits, sweep ALL modified files at once
Run before declaring anything done:
```bash
for f in file1.html file2.html file3.html; do
  echo -n "$f: "; tail -1 $f
done
```
Do not check files one at a time as you go — check all of them together at the end.

### Rule 5: Never say "done", "ready to push", or "complete" until verification output is shown
The final message must include the actual terminal output from the checks above. If the checks haven't been run, the work is not done. Showing the plan to verify is not the same as verifying.

### Rule 6: Do not edit any file that is not directly related to the task
If the task is "fix the calculator padding", only `walmart-connect-calculator.html` should change. Do not touch `llms.txt`, `sitemap.xml`, `blog.html`, or any other file unless the task explicitly requires it. Confirm scope before writing.

### Rule 7: Git diff review is mandatory before every push
Run `git diff --stat HEAD` and read every changed file in the output. If a file appears in the diff that shouldn't be there, investigate before pushing.

### Rule 8: When auditing or writing title tags, always count the FULL tag content — including the brand suffix
Title tags on this site end with ` | SellTru`. Never count just the descriptive portion alone. Always measure the complete string as it will appear in the `<title>` element.

Before presenting title options to Andrew, verify the full character count with:
```bash
echo -n "Your Proposed Title | SellTru" | wc -c
```

The limit is 60 characters. If a proposed title is over 60, do not present it — shorten it first.
