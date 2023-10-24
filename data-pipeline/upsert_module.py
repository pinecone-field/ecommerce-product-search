def upsert_data(ids_vectors_chunk, index_name, environment, api_key):
    import pinecone  # Import pinecone here, within the function

    pinecone.init(api_key=api_key, environment=environment)

    with pinecone.GRPCIndex(index_name) as index:
        index.upsert_from_dataframe(df=ids_vectors_chunk, batch_size=1000, show_progress=True)

