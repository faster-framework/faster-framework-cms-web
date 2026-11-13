const section = {
  id: '1001',
  parentId: '0',
  name: '新闻中心',
  code: 'news',
  sort: 1,
  templateType: 1,
  publishStatus: 1,
  showStatus: 1,
  topStatus: 0,
  createDate: '2026-01-01 10:00:00',
};

const article = {
  id: '2001',
  sectionId: '1001',
  title: '测试文章',
  code: 'test-article',
  sort: 0,
  publishStatus: 1,
  showStatus: 1,
  topStatus: 0,
  publishDate: '2026-01-01 10:00:00',
};

export default {
  'GET /mock/section': [section],
  'GET /mock/section/tree': [{ ...section, children: [] }],
  'GET /mock/section/1001': section,
  'POST /mock/section': {},
  'PUT /mock/section/1001': {},
  'DELETE /mock/section/delete': {},
  'GET /mock/article': {
    records: [article],
    total: 1,
    size: 20,
    current: 1,
    pages: 1,
  },
  'GET /mock/article/2001': article,
  'POST /mock/article': {},
  'PUT /mock/article/2001': {},
  'DELETE /mock/article/delete': {},
  'POST /mock/site/generate': {},
};
