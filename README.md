# bigbrainmap

From sample repo:

> - Displays a mindmap type layout.
> - Loads basic information from FreeMind Mind Map format (\*.mm).
> - Shows moving nodes from one side to another, adding nodes, and switching out data.
> - The basics are all in place, needs cleanup and a way to edit node text.
>   - Need a way to select a node to edit, maybe change click from toggle to select?
>   - Need a way to update the node text, once selected start typing and you get an edit to change the text?
> - You can expand and collapse the nodes by clicking on them.

## Setup

We use conventional commit tools and standard-version to guide and automate traceability along the lifetime of the big braing mind mapping wonderland project.

BREAKING.feature.patch (major.minor.patch)

```sh

# conventional commit helper tool. Run using cz in local repo or use npx cz
# npm install -g commitizen

# vs code extensions installer script
./scripts/ide/vs-code-extensions-installer.sh

# node_modules
npm ci


```
