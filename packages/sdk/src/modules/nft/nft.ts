import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonResponse, IApillonListResponse } from '../../types/apillon';
import {
  ICollectionFilters,
  ICollection,
  ICreateCollection,
} from '../../types/nfts';
import { NftCollection } from './nft-collection';

export class Nft extends ApillonModule {
  /**
   * @dev API url for collections.
   */
  private API_PREFIX = '/nfts/collections';

  /**
   * @dev Returns a collection instance.
   * @param uuid Unique collection identifier.
   * @returns An instance of NFT Collection
   */
  public collection(uuid: string): NftCollection {
    return new NftCollection(uuid, null);
  }

  /**
   * Lists all nft collections available.
   * @param {ICollectionFilters} params Filter for listing collections.
   * @returns Array of NftCollection.
   */
  public async list(params?: ICollectionFilters): Promise<NftCollection[]> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const { data } = await ApillonApi.get<IApillonListResponse<ICollection>>(
      url,
    );

    return data.data.items.map(
      (nft) => new NftCollection(nft.collectionUuid, nft),
    );
  }

  /**
   * Deploys a new NftCollection smart contract.
   * @param data NFT collection data.
   * @returns A NftCollection instance.
   */
  public async create(data: ICreateCollection) {
    const { data: response } = await ApillonApi.post<
      IApillonResponse<ICollection>
    >(this.API_PREFIX, data);

    return new NftCollection(response?.data.collectionUuid, response?.data);
  }
}
