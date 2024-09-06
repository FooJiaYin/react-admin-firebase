import * as ra from '../../misc/react-admin-models';
import { FireClient } from '../database/FireClient';
export declare function GetList<T extends ra.Record>(resourceName: string, params: ra.GetListParams, client: FireClient): Promise<ra.GetListResult<T>>;
