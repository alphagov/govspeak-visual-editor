# Changelog

- We use the [GOV.UK versioning guidelines](https://docs.publishing.service.gov.uk/manual/publishing-a-ruby-gem.html#versioning).
- Mark breaking changes with `BREAKING:`. Be sure to include instructions on how applications should be upgraded.
- Include a link to your pull request.
- Don't include changes that are purely internal. The CHANGELOG should be a useful summary for people upgrading their
  application, not a replication of the commit log.

## Unreleased

## 3.0.0

- Accept an options parameter to pass images from the parent application to the visual editor
- Add images to the schema and validation and paste plugins

## 2.0.0

- Fix bug with list item deletion
- Refactor button tracking

## 1.5.0

- Add remove button to link tooltip
- Fix tabbing through the toolbar in Firefox - [PR](https://github.com/alphagov/govspeak-visual-editor/pull/123)
- Add skipped heading level linting - [PR #125](https://github.com/alphagov/govspeak-visual-editor/pull/125)

## 1.4.0

- Small adjustments to link tooltips
- Add tracking events to dropdown selects

## 1.3.0

- GA4 tracking added to buttons

## 1.2.0

- Change the behaviour of the heading select.
- Introduce a link tooltip plugin

## 1.1.0

- Remove contact; example, information and warning callouts; and steps from the toolbar.
- Fix: address format and rendering
- Fix: linebreak and backspace for new list items
- Allow selected text to be linked to an email
- Fix: Link title tooltip for new links
- Add licence

## 1.0.6

- Remove the dist folder ([PR here](https://github.com/alphagov/govspeak-visual-editor/pull/69))

## 1.0.5

- Initial publishing of package to npm
