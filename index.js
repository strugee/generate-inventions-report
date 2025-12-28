#!/usr/bin/env node

/*

Copyright 2025 AJ Jordan <alex@strugee.net>.

This file is part of generate-inventions-report.

generate-inventions-report is free software: you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

generate-inventions-report is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with generate-inventions-report. If not, see
<https://www.gnu.org/licenses/>.

*/

// Much of this file is cribbed from count-your-issues.

'use strict';

const assert = require('assert'),
      path = require('path');

assert(process.argv[2], 'no config provided');

const config = require(path.resolve(process.argv[2]));

assert(Array.isArray(config.providers), 'configuration `providers` isn\'t a single array');

const since = new Date(config.since);
assert.notStrictEqual(since.toString(), 'Invalid Date', 'must provide a valid `since` ISO 8601 date');

// TODO assert that stdout isn't a TTY - users should probably be piping this to grep -v

const jobs = config.providers.forEach(async function execDirective(directive) {
	assert(directive.type, 'directive has no type');

	// It's okay to do this in a loop because require() caches paths
	// It's also okay to blindly require() user input because they wrote the config
	const provider = require(`./lib/${directive.type}`);

	provider.init(directive);
	await provider.verify(directive);
	// TODO better date validation etc.
	const results = await provider.invoke(since, directive);
	console.log(results.join('\n'));
});
