import { session, setPublicationUri, xrpc, xrpcGet, DID } from './lib/standard-site.mjs';

const accessJwt = await session();
const existing = await xrpcGet(accessJwt, 'com.atproto.repo.listRecords', {
	repo: DID,
	collection: 'site.standard.publication',
	limit: '100'
});
const matchingRecords = existing.records.filter(({ value }) => value.url === 'https://theosteiner.de');

if (matchingRecords.length > 1) {
	throw new Error(
		`Found ${matchingRecords.length} publication records for https://theosteiner.de. ` +
			'Delete the duplicates before running this command again.'
	);
}

if (matchingRecords.length === 1) {
	await setPublicationUri(matchingRecords[0].uri);
	console.log(`Reused and configured ${matchingRecords[0].uri}`);
	process.exit(0);
}

const record = await xrpc(accessJwt, 'com.atproto.repo.createRecord', {
	repo: DID,
	collection: 'site.standard.publication',
	record: {
		$type: 'site.standard.publication',
		url: 'https://theosteiner.de',
		name: 'Theo Steiner',
		description: "Theo Steiner's personal website & blog"
	}
});

await setPublicationUri(record.uri);
console.log(`Created and configured ${record.uri}`);
