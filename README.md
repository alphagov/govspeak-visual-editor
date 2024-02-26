# Govspeak visual editor

This repo demonstrates how [ProseMirror] could be used to build a visual editor for [Govspeak].

Govspeak is a flavour of Markdown used for publishing content on [GOV.UK].

[ProseMirror]: https://prosemirror.net
[Govspeak]: https://github.com/alphagov/govspeak
[GOV.UK]: https://www.gov.uk

## Local development

1. Clone this repo
2. Install dependencies
   ```
   npm install
   ```
3. Run the development server
   ```
   npm run dev
   ```
4. Open the [example editor](http://localhost:5173/)

5. Run tests
   ### Unit tests
   ```
   npm run test
   ```
   ### e2e tests
   ```
   npm run e2e-test
   ```
## Editor overview

The editor implements a schema based on the [prosemirror-schema-basic] and [prosemirror-schema-list] modules, extended with some Govspeak-specific nodes (such as [callouts]).

It also builds upon the [prosemirror-example-setup] package which provides a basic editor UI and some useful configuration defaults.

[prosemirror-schema-basic]: https://prosemirror.net/docs/ref/#schema-basic
[prosemirror-schema-list]: https://prosemirror.net/docs/ref/#schema-list
[callouts]: https://github.com/alphagov/govspeak#callouts
[prosemirror-example-setup]: https://prosemirror.net/examples/basic/

### Govspeak-specific nodes

You'll find custom Govspeak-specific nodes defined in the [src/nodes](src/nodes) directory.

Each 'node' file in that directory defines a few things:

1. A [NodeSpec], which describes the node's schema for use with the [prosemirror-model] module
2. Input rules, which enable users to type Markdown-esque syntax to create nodes using the [prosemirror-inputrules] module
3. A `buildMenu` function which can add custom buttons to the toolbar menu provided by the [prosemirror-example-setup] module.

[NodeSpec]: https://prosemirror.net/docs/ref/#model.NodeSpec
[prosemirror-model]: https://prosemirror.net/docs/ref/#model
[prosemirror-inputrules]: https://prosemirror.net/docs/ref/#inputrules
