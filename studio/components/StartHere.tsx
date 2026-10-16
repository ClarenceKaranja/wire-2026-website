import {Box, Card, Heading, Stack, Text} from '@sanity/ui'

const steps: Array<[string, string]> = [
  [
    'Edit and publish',
    'Open an item, make your changes, then click the green Publish button at the bottom right. Changes are saved as a draft automatically until you publish. Published changes appear on the public website within about a minute.',
  ],
  [
    'Unpublish or remove',
    'Use the ⋯ menu next to Publish and choose Unpublish. The item disappears from the website but stays here as a draft. Delete removes it permanently.',
  ],
  [
    'Programme',
    'Programme → Sessions by day. Pick a day, then click a session to change its title, times, description or speakers. The order follows the start time. To publish a new agenda PDF, open Documents and replace the file in the agenda document.',
  ],
  [
    'Photos',
    'Photo gallery → open an album → drag several photos into the Photos box. Click each photo to add alternative text and a caption. Tick "All visible photos are approved" and Publish. Empty albums are hidden from visitors.',
  ],
  [
    'Documents',
    'Documents and downloads → Create new (the pencil icon). Add a title, category and file, tick "Approved for public release" and Publish. Set "Where it appears" to Archived to move an old version out of the main list.',
  ],
  [
    'Announcements',
    'Announcements → Create new. Add a title and message, optionally an expiry date, then Publish. Tick "Highlight on the homepage" for important notices.',
  ],
  [
    'French and Portuguese',
    'Participant information sections, FAQs and the Participant information page have English, Français and Português tabs at the top. When you change the English text, update the other two tabs as well. A tab left empty shows the English text on the website. Everything else on the site is English only.',
  ],
  [
    'Before you publish',
    'Only publish material cleared for anyone on the internet. Never upload passports, participant lists, contact details, restricted meeting schedules or room assignments, internal planning or procurement documents. Uploaded files can be reached by anyone who has their link, even after you unpublish them; to remove a file completely, delete it from the document and then from the Media library.',
  ],
]

export function StartHere() {
  return (
    <Box padding={4} style={{maxWidth: 760}}>
      <Stack gap={4}>
        <Heading size={2}>How to edit the WIRE website</Heading>
        <Text size={2} muted>
          Everything on the public website comes from this editor. You never need to change code to update content.
        </Text>
        {steps.map(([title, body]) => (
          <Card key={title} padding={4} radius={2} shadow={1}>
            <Stack gap={3}>
              <Heading size={1}>{title}</Heading>
              <Text size={2}>{body}</Text>
            </Stack>
          </Card>
        ))}
        <Text size={1} muted>
          The full guides are in the project’s docs folder (docs/editor-guide.md).
        </Text>
      </Stack>
    </Box>
  )
}
