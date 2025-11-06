module.exports = {
  extends: ['gitmoji', '@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(:\w+:|\p{Emoji_Presentation}|\p{Emoji})?\s?(\w*)(?:\((.*)\))?:\s?(.*)$/u,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'Feat',
        'Fix',
        'Focs',
        'Chore',
        'Style',
        'Refactor',
        'Ci',
        'Test',
        'Revert',
        'Perf',
        'Build',
        'Release',
        'Wrench',
      ],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'header-max-length': [2, 'always', 1000],
    'subject-case': [0],
    'type-case': [0],
    'subject-case': [
      0,
      'always',
      [
        'sentence-case',
        'start-case',
        'pascal-case',
        'upper-case',
        'lower-case',
      ],
    ],
  },
};
