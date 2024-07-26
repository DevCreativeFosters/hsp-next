import ColumnsFacts from '@components/columns-facts/columns-facts';

export default function ColumnsFactsBlock(block) {
  if (!block) return null;

  const alignment = block?.alignment;
  const columns = block?.columns;
  const image = block?.image;
  const media = block?.media;
  const title = block?.title;
  const videoFile = block?.videoFile;

  return (
    <ColumnsFacts
      alignment={alignment}
      columns={columns}
      image={image}
      media={media}
      title={title}
      videoFile={videoFile}
    />
  );
}
