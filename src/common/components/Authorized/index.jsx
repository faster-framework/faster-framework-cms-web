import Permission from '../Permission';
import Secured from './Secured';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';
Permission.Secured = Secured;
Permission.check = check;
const RenderAuthorize = renderAuthorize(Permission);
export default RenderAuthorize;
