import { ColumnAlias } from '@/types/mapping';

export const COLUMN_DICTIONARY: ColumnAlias[] = [
  {
    canonical: 'date',
    aliases: ['date', '日付', '配信日'],
  },
  {
    canonical: 'spend',
    aliases: ['cost', 'spend', '広告費', '消化金額', '金額'],
  },
  {
    canonical: 'impressions',
    aliases: ['impressions', 'imp', '表示回数'],
  },
  {
    canonical: 'clicks',
    aliases: ['clicks', 'クリック', 'click数', 'クリック数'],
  },
  {
    canonical: 'conversions',
    aliases: ['conversions', 'cv', '成果', 'コンバージョン', 'CV数', 'cv数'],
  },
];
