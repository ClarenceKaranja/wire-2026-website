import {defineArrayMember, defineField, defineType} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About WIRE page',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({name: 'intro', title: 'Introduction', type: 'blockContent'}),
    defineField({
      name: 'objectives',
      title: 'Objectives',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'body', title: 'More about the Forum', type: 'blockContent'}),
    defineField({name: 'organizersText', title: 'About the organizers', type: 'blockContent'}),
  ],
  preview: {prepare: () => ({title: 'About WIRE page'})},
})
