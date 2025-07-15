import { v4 as uuidv4 } from 'uuid';

import type { CardListResult, ListResult } from '@/api/model/listModel';
import { request } from '@/utils/request';

const Api = {
  BaseList: '/get-list',
  CardList: '/get-card-list',
};

export function getList() {
  return request.get<ListResult>(
    {
      url: Api.BaseList,
    },
    {
      dataHandle(data: ListResult) {
        data.list.forEach((item) => {
          item.uuid = uuidv4();
        });
        console.log(data);
        return data;
      },
    },
  );
}

export function getCardList() {
  return request.get<CardListResult>({
    url: Api.CardList,
  });
}
