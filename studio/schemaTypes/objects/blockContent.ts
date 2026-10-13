import {defineArrayMember, defineField, defineType} from 'sanity'

/** Simple rich text: paragraphs, two heading levels, lists, bold, italic and links. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h3'},
        {title: 'Sub-heading', value: 'h4'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Web address',
                description:
                  'A full address such as https://example.org, an email such as mailto:unodc-wire@un.org, or a page on this site such as /programme.',
                type: 'string',
                validation: (rule) =>
                  rule.required().custom((v) =>
                    !v || /^(https?:\/\/|mailto:|tel:|\/)/.test(v)
                      ? true
                      : 'Start with https://, mailto:, tel: or / for a page on this site.',
                  ),
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
