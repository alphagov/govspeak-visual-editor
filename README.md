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

## Making changes

You should keep track of relevant unreleased changed by adding to the "Unreleased" section of the [`CHANGELOG.md`](/CHANGELOG.md).

## Publishing to npm

1. Checkout **main** and pull latest changes.

2. Create and checkout a new branch (`release-[version-number]`).
   The version number is determined by looking at the [current "Unreleased" changes in CHANGELOG](/CHANGELOG.md) and updating the previous release number depending on the kind of entries:

- `Breaking changes` corresponds to a `major` (1.X.X) change.
- `New features` corresponds to a `minor` (X.1.X) change.
- `Fixes` corresponds to a `patch` (X.X.1) change.

For example if the previous version is `2.3.0` and there are entries for `Breaking changes` then the new release should be `3.0.0`.

See [Semantic Versioning](https://semver.org/) for more information.

3. Update [`CHANGELOG.md`](/CHANGELOG.md) "Unreleased" heading with the new version number and [review the latest commits](https://github.com/alphagov/govspeak-visual-editor/commits/main/) to make sure the latest changes are correctly reflected in the [CHANGELOG](/CHANGELOG.md)).

4. Update [`package.json`](/package.json) version with the new version number.

5. Run `npm install` to ensure you have the latest dependencies installed.

6. Commit changes. These should include updates in the following files:

- [`CHANGELOG.md`](/CHANGELOG.md)
- [`package.json`](/package.json)
- [`package-lock.json`](/package-lock.json)

7. Create a pull request and copy the changelog text for the current version in the pull request description.

8. Once the pull request is approved, merge into the `main` branch. This action will trigger the CI to publish the new version to NPM. A [dependabot](https://github.com/dependabot) pull request will automatically be raised in relevant applications.

## GA4 Tracking

GA4 tracking data attributes have been added to the following components of the Visual Editor:

- Toolbar button clicks

The following events are emitted from the Visual Editor. Please add an event handler to any parent wrapper to handle the event for tracking purposes.

- `visualEditorSelectChange` - emitted when select values change on dropdowns in the toolbar. Details sent with the event can be accessed via:
  - `event.detail.selectText` which returns the text of the selected option in the dropdown

**Please note**: data-module `ga4-event-tracker` needs to be initialised in the parent application that is importing the visual editor for this tracking to work.
