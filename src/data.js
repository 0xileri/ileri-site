import avatar from './assets/avatar-x.jpg'
import banner from './assets/banner-x.jpg'
import launchmynft from './assets/launchmynft.jpg'
import bungee from './assets/bungee.jpg'
import perlelabs from './assets/perlelabs.jpg'
import melee from './assets/melee-market.jpg'
import yetch from './assets/yetch.jpg'
import euclid from './assets/euclid.jpg'
import altura from './assets/altura.jpg'

export const X_URL = 'https://x.com/0xileri'
export const AVATAR = avatar
export const BANNER = banner // current @0xileri X banner (1500x500)
export const AI_VIDEO_URL = 'https://x.com/0xileri/status/2088141897906680180'

const post = (id) => `https://x.com/0xileri/status/${id}`

// Real numbers only. Followers checked on X on Nov 14, 2026 (10,683).
export const stats = [
  { value: '10.6K+', label: 'followers on X' },
  { value: '30+', label: 'web3 projects worked with' },
  { value: '20+', label: 'ecosystems with bounty wins' },
  { value: '$3,000', label: 'OKX hackathon win' },
]

export const ecosystems = [
  'OKX', 'LaunchMyNFT', 'Bungee', 'PerleLabs', 'Melee Market', 'Dzap', 'Altura',
  'Euclid', 'Yetch', 'Higgsfield', 'Triad', 'WienerLabs', 'Beaks', 'Unipix', '365',
]

export const services = [
  {
    n: '01',
    title: 'Content and exposure',
    body: 'Posts and quote posts about your project on my page, written in my own voice for a crowd that already follows AI and crypto. I also engage with your posts every day so they keep getting pushed.',
    tags: ['Posts', 'Quote posts', 'Daily engagement'],
  },
  {
    n: '02',
    title: 'KOL campaigns',
    body: 'I manage a group of creators. I pick the ones that fit your project, brief them, keep the posts on schedule and send you every link after.',
    tags: ['Creator picks', 'Briefs', 'Tracking'],
  },
  {
    n: '03',
    title: 'Community setup and growth',
    body: 'Discord or Telegram set up properly with channels, roles and a welcome flow. Then quests, giveaways and engagement drives to bring people in and keep them around.',
    tags: ['Discord', 'Telegram', 'Quests and giveaways'],
  },
  {
    n: '04',
    title: 'AI video',
    body: 'Launch videos, trailers and explainers made with AI. Quick to turn around and easy to share on the timeline.',
    tags: ['Launch videos', 'Trailers', 'Explainers'],
    link: { label: 'See recent AI video work', href: AI_VIDEO_URL },
  },
]

export const packages = [
  {
    name: 'Starter',
    price: '$1,000',
    items: [
      '4 posts on my page',
      '4 quote posts',
      'Daily engagement with your posts',
      'Basic community setup (Discord or Telegram structure, roles, welcome flow)',
    ],
  },
  {
    name: 'Growth',
    price: '$2,500',
    featured: true,
    items: [
      '8 posts + 8 quotes',
      'KOL push with 5 creators from my network',
      'Community growth campaigns (quests, giveaways, engagement drives)',
      'Weekly report',
    ],
  },
  {
    name: 'Launch',
    price: '$5,000',
    items: [
      'Everything in Growth',
      'Bigger KOL campaign with 10-15 creators',
      'A 1-minute AI launch video or trailer',
      'Launch week planning and coordination',
    ],
  },
]

export const oneOff = [
  { item: 'Post on my page', price: '$150-200' },
  { item: 'Quote post', price: '$100' },
  { item: '1-minute AI video', price: '$300-500' },
  { item: 'KOL campaign', price: 'Priced by size' },
]

export const steps = [
  { n: '01', title: 'Pitch', body: 'You DM me, or I reach out first. We talk about what you are building and where you want to get to.' },
  { n: '02', title: 'Plan', body: 'I put together the posts, creators, community steps and video you need, with dates attached.' },
  { n: '03', title: 'Launch', body: 'We go live. I run the plan, share links as things post, and send a report so you can see what worked.' },
]

export const featured = [
  { name: 'LaunchMyNFT', badge: '1st place', kicker: 'Creator campaign', body: 'First place in the LaunchMyNFT creator campaign.', img: launchmynft, href: post('2049553153738117425') },
  { name: 'Bungee', badge: '1st place', kicker: 'Community campaign', body: 'Top community submission across the whole Bungee campaign.', img: bungee, href: post('2035001439517335798') },
  { name: 'PerleLabs', badge: 'Top 5', kicker: '10,000+ submissions', body: 'Ranked top 5 on a leaderboard with more than 10,000 submissions.', img: perlelabs, href: post('2037235146655478071') },
]

export const builds = [
  {
    name: 'LEAPSY',
    tag: '$3,000 OKX hackathon win',
    body: 'An options strategy agent for long-horizon crypto investors, using real listed Deribit contracts. Listed on OKX.AI.',
    href: post('2085564399511638201'),
    cta: 'Win post on X',
  },
  {
    name: 'SpactVault',
    tag: 'Live on NEAR mainnet',
    body: 'Spending limits for AI agents. Small payments go through, bigger ones wait for the owner to approve, and anything over the limit gets refused on chain.',
    href: 'https://github.com/0xileri/SpactVault',
    cta: 'Code on GitHub',
  },
  {
    name: 'Hunch',
    tag: 'Orbio Build Week',
    body: 'An agent with its own inference budget. It watches public sources for free and only pays for research when a narrative looks worth it.',
    href: 'https://github.com/0xileri/hunch',
    cta: 'Code on GitHub',
  },
  {
    name: 'Rung',
    tag: 'Stocklana hackathon',
    body: 'A capital-backed valuation market for PreStocks on Solana.',
    href: 'https://github.com/0xileri/rung',
    cta: 'Code on GitHub',
  },
]

export const wins = [
  { name: 'OKX (LEAPSY)', result: '$3,000 hackathon win', type: 'Hackathon', href: post('2085564399511638201') },
  { name: 'LaunchMyNFT', result: '1st place', type: 'Win', href: post('2049553153738117425') },
  { name: 'Bungee', result: '1st place', type: 'Win', href: post('2035001439517335798') },
  { name: 'PerleLabs', result: 'Top 5 of 10,000+', type: 'Placement', href: post('2037235146655478071') },
  { name: 'Melee Market', result: 'Winner', type: 'Win', href: post('2053754076479770751') },
  { name: 'Dzap', result: 'Winner', type: 'Win', href: post('2041162404545843711') },
  { name: 'Altura', result: 'Winner', type: 'Win', href: post('2025497795415662709') },
  { name: 'Euclid', result: 'Winner', type: 'Win', href: post('2032896106808414325') },
  { name: 'Yetch', result: 'Winner', type: 'Win', href: post('2033976307210481759') },
  { name: 'Beaks NFT', result: 'NFT spot', type: 'NFT spot', href: post('2052951163050377622') },
  { name: 'Unipix NFT', result: 'NFT spot', type: 'NFT spot', href: post('2054063310794788879') },
  { name: '365 NFT', result: 'NFT spot', type: 'NFT spot', href: post('2050268007709241640') },
]

export const receipts = [
  { name: 'LaunchMyNFT', label: '1st place', img: launchmynft, href: post('2049553153738117425') },
  { name: 'Bungee', label: '1st place', img: bungee, href: post('2035001439517335798') },
  { name: 'Melee Market', label: 'Winner', img: melee, href: post('2053754076479770751') },
  { name: 'PerleLabs', label: 'Top 5 leaderboard', img: perlelabs, href: post('2037235146655478071') },
  { name: 'Yetch', label: '2nd place', img: yetch, href: post('2033976307210481759') },
  { name: 'Euclid', label: 'Winner', img: euclid, href: post('2032896106808414325') },
  { name: 'Altura', label: 'Winner', img: altura, href: post('2025497795415662709') },
]

export const roles = [
  { name: 'Higgsfield', role: 'Creator' },
  { name: 'Triad', role: 'Contributor' },
  { name: 'WienerLabs', role: 'Affiliate partner' },
]

export const contacts = [
  { label: 'X (DMs open)', value: '@0xileri', href: X_URL, primary: true },
  { label: 'Telegram', value: '@oxileri', href: 'https://t.me/oxileri' },
  { label: 'Email', value: 'bapkingboss2@gmail.com', href: 'mailto:bapkingboss2@gmail.com' },
  { label: 'YouTube', value: '@0xileri', href: 'https://youtube.com/@0xileri' },
  { label: 'TikTok', value: '@0xileri', href: 'https://www.tiktok.com/@0xileri' },
  { label: 'Instagram', value: '@0xileri', href: 'https://www.instagram.com/0xileri' },
]

// Profile header. Counts checked on X on Nov 14, 2026 (10,683 followers, 2,494 following).
export const profile = {
  name: 'ileri 𖣂',
  handle: '@0xileri',
  bio: 'Growth for early AI and crypto projects. Posts on my page, KOL campaigns, community setup and AI video. Builder with a $3,000 OKX hackathon win.',
  site: 'ileri.lol',
  followers: '10.6K+',
  following: '2.4K',
}

export const whoToFollow = [
  { name: 'ileri 𖣂', handle: '@0xileri', href: X_URL, avatar: avatar, cta: 'Follow' },
  { name: 'SpactVault', handle: '@spactvault', href: 'https://x.com/spactvault', letter: 'S', cta: 'Follow' },
  { name: 'ileri on GitHub', handle: 'github.com/0xileri', href: 'https://github.com/0xileri', letter: 'G', cta: 'View' },
  { name: 'ileri on YouTube', handle: 'youtube.com/@0xileri', href: 'https://youtube.com/@0xileri', letter: 'Y', cta: 'View' },
]

// Real X article, stats from fxtwitter on Nov 14, 2026.
import articleCover from './assets/ai-video-article.jpg'
export const article = {
  title: "how i make AI videos (a beginner's breakdown)",
  preview: "I've been getting a lot of DMs since I started posting AI videos, so I figured I'd just write it all out.",
  href: 'https://x.com/0xileri/status/2058611697187782908',
  cover: articleCover,
  counts: { replies: '245', reposts: '127', likes: '1.3K', views: '127K' },
}
