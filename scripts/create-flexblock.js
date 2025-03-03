#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

// Convert string to different cases
const toKebabCase = str =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const toPascalCase = str =>
  str.replace(/(^\w|-\w)/g, c => c.replace(/-/, '').toUpperCase());

async function createBlock(blockName) {
  const kebabCase = toKebabCase(blockName);
  const pascalCase = toPascalCase(blockName);

  const directories = {
    apiAcfBlocks: path.join(process.cwd(), 'lib', 'api-acf-blocks'),
    blocks: path.join(process.cwd(), 'lib', 'blocks'),
    components: path.join(process.cwd(), 'components', kebabCase),
  };

  // Create component directory if it doesn't exist
  await fs.mkdir(directories.components, { recursive: true });

  // Create files
  const files = {
    apiAcfBlock: path.join(directories.apiAcfBlocks, `${kebabCase}.js`),
    block: path.join(directories.blocks, `${kebabCase}.js`),
    component: path.join(directories.components, `${kebabCase}.js`),
    styles: path.join(directories.components, `${kebabCase}.module.scss`),
  };

  // Template contents
  const templates = {
    apiAcfBlock: `import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ${pascalCase} = () => {
  return /* GraphQL */ \`
    ... on \${blockPrefix}${pascalCase}\${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      bodyText
    }
  \`;
};`,

    block: `import ${pascalCase} from '@components/${kebabCase}/${kebabCase}';

export default function ${pascalCase}Block(block) {
  if (!block) return null;

  return <${pascalCase} {...block} />;
}`,

    component: `import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './${kebabCase}.module.scss';

export default function ${pascalCase}({
  title,
  titleTag,
  titleTagStyle,
  bodyText,
}) {
  return (
    <Container>
        {title && (
          <DynamicTitle
            className={styles.title}
            titleTag={titleTag}
            titleTagStyle={titleTagStyle}
          >
            {title}
          </DynamicTitle>
        )}
        {bodyText && (
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        )}
    </Container>
  );
}`,

    styles: `.title {
  // Add title styles
}

.content {
  // Add content styles
}`,
  };

  // Write files
  for (const [key, filePath] of Object.entries(files)) {
    await fs.writeFile(filePath, templates[key]);
    console.log(`Created ${filePath}`);
  }

  console.log('\nBlock created successfully! 🎉');
  console.log('\nNext steps:');
  console.log('1. Add the block to lib/blocks/index.js');
  console.log('2. Add the block to lib/block.js');
  console.log('3. Review the generated files and customize as needed');
  console.log(
    '4. Update the GraphQL fragment in the API file to match your ACF field configuration',
  );
  console.log('5. Style your component using the generated SCSS module');
}

program
  .argument('<block-name>', 'Name of the block (in PascalCase or kebab-case)')
  .action(async blockName => {
    try {
      await createBlock(blockName);
    } catch (error) {
      console.error('Error creating block:', error);
      process.exit(1);
    }
  });

program.parse();
