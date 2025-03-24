export const prepareSchemas = schemas => {
  if (!schemas || !Array.isArray(schemas)) return null;

  const schemasNormalized = schemas.map(schema => {
    try {
      const schemaParsed = JSON.parse(schema.schema);
      return (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaParsed) }}
          data-wp-schema=""
          key={schema.hash}
          type="application/ld+json"
        />
      );
    } catch (error) {
      const text = `Failed to parse schema: ${schema.schema}`;
      return (
        <script data-wp-schema-error="" key={schema.hash} type="text/plain">
          {text}
        </script>
      );
    }
  });

  return <>{schemasNormalized}</>;
};
