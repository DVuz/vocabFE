/**
 * A curated pool of plausible English word definitions used as fallback
 * distractors in the quiz when the user's review queue has fewer than 4 cards.
 *
 * Entries are intentionally varied in part-of-speech and topic so they look
 * realistic but are clearly wrong for any given target word.
 */
export const DISTRACTOR_POOL: string[] = [
  // verbs
  'to move quickly from one place to another',
  'to express disagreement or objection strongly',
  'to bring together into a single group or collection',
  'to make something larger or more powerful',
  'to become aware of something through the senses',
  'to cause something to happen at an earlier time',
  'to examine something carefully in order to understand it',
  'to prevent someone from doing or achieving something',
  'to give official permission or approval for something',
  'to spread or distribute something widely',
  'to change something from one form or system to another',
  'to accept or start using something new',
  'to divide something into two or more parts',
  'to move back or away from a difficult situation',
  'to remove something that is no longer needed',
  'to put something in a particular place for safekeeping',
  'to repeat an action or process in order to confirm a result',
  'to combine two or more things to form a whole',
  'to show that something is true by providing evidence',
  'to produce a large amount of something over time',

  // nouns – abstract
  'the ability to understand and share the feelings of others',
  'a set of ideas or a plan for achieving a goal in the future',
  'the practice of treating all people fairly and equally',
  'a feeling of great happiness and satisfaction',
  'an official agreement between two or more parties',
  'the process of becoming stronger or more advanced',
  'a sudden and dramatic change in a situation or society',
  'the quality of being honest and having strong moral principles',
  'a series of actions intended to achieve a particular result',
  'the state of being in charge of or responsible for something',
  'a long journey, especially by sea or through space',
  'the way in which two or more people or things are connected',
  'an event that happens by chance and causes damage or injury',
  'a period of time when progress or activity is interrupted',
  'the science or practice of growing crops and raising livestock',
  'a person who provides help or support to someone else',
  'a building used for public religious worship',
  'the total amount of goods produced by a country or company',
  'a formal statement that something is untrue or denied',
  'the process of removing harmful substances from water or air',

  // nouns – concrete / physical
  'a flat piece of material used as a surface for writing or drawing',
  'a device used to measure the temperature of something',
  'a container used to store and transport liquids',
  'an instrument used to look at distant objects more clearly',
  'a small opening in a wall, door, or fence',
  'a long thin piece of metal or wood used as a support',
  'a short piece of writing that gives information or instructions',
  'a type of food made from ground grain mixed with water and baked',
  'a soft material used to fill pillows or cushions',
  'a small piece of paper or card showing the price of something',

  // adjectives (used as definitions)
  'having a strong, sharp, or intense effect on the senses',
  'not changing or varying; staying the same over time',
  'relating to the origin or earliest period of something',
  'happening after the expected or usual time',
  'showing a tendency to cause harm or damage to others',
  'having more than one possible meaning or interpretation',
  'very important and having a major effect on future events',
  'done or happening regularly and according to a plan',
  'involving a great deal of effort, care, or attention to detail',
  'belonging or relating to a particular person or thing',
];
