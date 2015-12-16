import es from 'elasticsearch';

var esClient = new es.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "randomindex";

/**
* Delete an existing index
*/
export let deleteIndex = () => {
    return esClient.indices.delete({
        index: indexName
    });
}

/**
* create the index
*/
export let initIndex = () => {
    return esClient.indices.create({
        index: indexName
    });
}

/**
* check if the index exists
*/
export let indexExists = () => {
    return esClient.indices.exists({
        index: indexName
    });
}

export let initMapping = () => {
    return esClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "string" },
                content: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}

export let addDocument = (doc) => {
    return esClient.index({
        index: indexName,
        type: "document",
        body: {
            title: doc.title,
            content: doc.content,
            suggest: {
                input: doc.title.split(" "),
                output: doc.title,
                payload: doc.metadata || {}
            }
        }
    });
}

export let getSuggestions = (input) => {
    return esClient.suggest({
        index: indexName,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true
                }
            }
        }
    });
}
