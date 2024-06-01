/**
 * The concerto graph namespaces, used for internal nodes
 */
export const ROOT_NAMESPACE = 'org.accordproject.graph@1.0.0';

/**
 * The concerto graph model, defines internal nodes 
 */
export const ROOT_MODEL = `namespace ${ROOT_NAMESPACE}
@notool
concept ConcertoModels extends GraphNode {
    o String content
}
concept GraphNode identified by identifier {
    o String identifier
}
@notool
concept EmbeddingCacheNode extends GraphNode {
    o Double[] embedding
    @vector_index("embedding", 1536, "COSINE")
    o String content  
}
`;