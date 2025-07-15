import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import baseMockDatas from './index';

export function setupProdMockServer() {
  createProdMockServer([...baseMockDatas]);
}
