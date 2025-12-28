/*

Copyright 2017, 2025 AJ Jordan <alex@strugee.net>.

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

'use strict';

const assert = require('assert'),
      Octokit = require('octokit').Octokit;

let octokit;

module.exports.init = function githubProviderInit(opts) {
	octokit = new Octokit({
		auth: opts.accessToken,
		userAgent: 'strugee/generate-inventions-report/' + require('../package.json').version
	});
}

module.exports.verify = async function githubProviderVerify(opts) {
	// TODO get rid of username, prolly
	assert(opts.username);
	// TODO move to pre-init phase
	assert(opts.accessToken, 'GitHub access token must be provided, to query private repos');
	const authResults = await octokit.rest.users.getAuthenticated(); // TODO
	assert.equal(authResults.status, 200);
	assert.equal(authResults.data.type, 'User');
	// TODO check that the PAT has the correct scopes
}

module.exports.invoke = async function githubProvider(since, opts) {
	// XXX figure out how this handles errors
	let repos = await octokit.paginate(octokit.rest.repos.listForUser, { username: opts.username, per_page: 100 });
	// TODO filter out repos archived before `since`, using the GQL API
	repos = repos.filter(repo => since < new Date(repo.updated_at) || since < new Date(repo.pushed_at));

	const originals = repos.filter(r => !r.fork);
	const forks = repos.filter(r => r.fork);
	// TODO more aggressive forks processing
	// TODO note cases where the project is partially covered
	debugger;
	return originals.map(repo => `Project: ${repo.html_url}`).concat(forks.map(repo => `Contributions: ${repo.html_url}`));
};
