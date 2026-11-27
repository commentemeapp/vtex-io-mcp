import { z } from 'zod'
import { findBlock } from '../knowledge/index.js'

export const addBlockSchema = {
  blockName: z
    .string()
    .describe(
      'VTEX IO block name to generate (e.g. "rich-text", "flex-layout.row", "shelf", "image", "info-card")'
    ),
  blockId: z
    .string()
    .optional()
    .describe(
      'Unique block identifier appended after #. Example: if blockId is "hero", result is "rich-text#hero". Defaults to the blockName.'
    ),
  props: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Props to set on the block. Keys must match valid prop names for the block.'),
  children: z
    .array(z.string())
    .optional()
    .describe('List of child block references (e.g. ["rich-text#title", "image#hero"])'),
}

export async function addBlock({
  blockName,
  blockId,
  props,
  children,
}: {
  blockName: string
  blockId?: string
  props?: Record<string, unknown>
  children?: string[]
}): Promise<{ content: Array<{ type: 'text'; text: string }> }> {
  const block = findBlock(blockName)

  const fullBlockName = blockId ? `${blockName}#${blockId}` : blockName

  if (!block) {
    // Still generate the snippet, just without validation
    const snippet: Record<string, unknown> = {}
    if (props && Object.keys(props).length > 0) snippet.props = props
    if (children && children.length > 0) snippet.children = children

    return {
      content: [
        {
          type: 'text',
          text: `Warning: Block "${blockName}" not found in knowledge base — generating snippet without prop validation.\n\n\`\`\`jsonc\n{\n  "${fullBlockName}": ${JSON.stringify(snippet, null, 4)}\n}\n\`\`\``,
        },
      ],
    }
  }

  // Validate provided props
  const validPropNames = new Set(block.props.map((p) => p.name))
  const unknownProps = props ? Object.keys(props).filter((k) => !validPropNames.has(k)) : []
  const requiredMissing = block.props
    .filter((p) => p.required && (!props || !(p.name in props)))
    .map((p) => p.name)

  const warnings: string[] = []
  if (unknownProps.length > 0) {
    warnings.push(
      `Warning: Unknown props (not in schema): ${unknownProps.map((p) => `\`${p}\``).join(', ')}`
    )
  }
  if (requiredMissing.length > 0) {
    warnings.push(
      `Warning: Required props not provided: ${requiredMissing.map((p) => `\`${p}\``).join(', ')}`
    )
  }

  const snippet: Record<string, unknown> = {}
  if (props && Object.keys(props).length > 0) snippet.props = props
  if (children && children.length > 0) snippet.children = children
  if (block.allowedChildren.length > 0 && block.allowedChildren[0] !== 'any' && !children) {
    snippet.blocks = block.allowedChildren
  }

  const warningsText = warnings.length > 0 ? warnings.join('\n') + '\n\n' : ''

  const text = `${warningsText}Add the following to your \`blocks.jsonc\` file:

\`\`\`jsonc
{
  "${fullBlockName}": ${JSON.stringify(snippet, null, 4)}
}
\`\`\`

**Block:** \`${block.app}@${block.version}\`
**Description:** ${block.description}

${block.allowedChildren.length > 0 ? `**Allowed children:** ${block.allowedChildren.join(', ')}` : ''}

**Available props:**
${block.props.map((p) => `- \`${p.name}\` (${p.type})${p.required ? ' **required**' : ''} — ${p.description}`).join('\n')}`

  return { content: [{ type: 'text', text }] }
}
