# generate-inventions-report

Generate a list of independent Inventions, for reporting to an employer that requires reporting these

## IMPORTANT disclaimer

Not only am I not your lawyer, I am not even _a_ lawyer! This tool should be considered a best-effort stopgap attempt to protect you/me, if you do not intend to pay for a lawyer. It may or may not work, legally speaking.

_Also_, it may or may not fit your particular employment contract. I can only fit the code to the legal language I've encountered. If your employment contract imposes reporting requirements that this tool does not cover, I am interested in maintaining customization options upstream.

## Usage

`generate-inventions-report` is invoked with a single argument, a path to a JSON config file. Like so:

    % generate-inventions-report config.json

The JSON config file is expected to be an object. The `since` key should be a date string parseable by [JavaScript `new Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), i.e., simplified ISO 8601; it indicates the date where code/issues/etc. may start to be covered by the contract.

The `providers` key should be a single array of objects describing where to look for issues. Each object has a `type` key, which specifies the provider plugin to use. The rest of the object keys are options for the provider. You can specify as many providers as you want, including specifying providers more than once.

## Provider config

### `github`

Queries `github.com`.

Takes one parameter, `accessToken`, which is a GitHub Personal Access token. You do not need to assign any scopes to this token, but you MUST grant access to "All repositories", not just "Public repositories". Generate a PAT [here](https://github.com/settings/personal-access-tokens/new). Example:

```json
{
  "type": "github",
  "accessToken": "github_pat_<redacted>"
}
```

# License

GNU GPL 3.0 or later

## Author

AJ Jordan <alex@strugee.net>
