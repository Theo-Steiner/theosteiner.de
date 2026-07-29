import { session, setPublicationUri, xrpc, DID } from './lib/standard-site.mjs';

const accessJwt = await session();
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
