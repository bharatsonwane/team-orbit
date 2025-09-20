import {
  userSchema,
  userLoginSchema,
  userSignupSchema,
  userUpdateSchema,
} from '../schemas/user.schema';
import { getUserDoc, updateUserPasswordDoc } from '../openApiSpecification/oasDoc/user.oas';
import { idValidation } from '../schemas/common.schema';
import {
  createUserProfile,
  getUserById,
  getUsers,
  postUserLogin,
  postUserSignup,
  signoutUser,
  updateUserPassword,
  updateUserProfile,
} from '../controllers/user.controller';
import RouteRegistrar from '../middleware/RouteRegistrar';
import { authRoleMiddleware } from '../middleware/authRoleMiddleware';

const registrar = new RouteRegistrar({
  basePath: '/api/user',
  tags: ['User'],
});

// /**@description user login  */
registrar.post('/login', {
  requestSchema: { bodySchema: userLoginSchema },
  responseSchemas: [{ statusCode: 200, schema: userSchema }],
  controller: postUserLogin,
});

/**@description user signup  */
registrar.post('/signup', {
  requestSchema: { bodySchema: userSignupSchema },
  responseSchemas: [{ statusCode: 200, schema: userSignupSchema }],
  controller: postUserSignup,
});

/**@description get all users  */
registrar.get('/list', {
  openApiDoc: getUserDoc,
  middleware: [authRoleMiddleware()],
  controller: getUsers,
});

/**@description Create User */
registrar.post('/create-user', {
  requestSchema: { bodySchema: userSchema },
  responseSchemas: [{ statusCode: 200, schema: userSchema }],
  controller: createUserProfile,
});

/**@description update user password  */
registrar.put('/:id/update-password/', {
  openApiDoc: updateUserPasswordDoc,
  requestSchema: {
    paramsSchema: { id: idValidation },
    bodySchema: userUpdateSchema,
  },
  middleware: [authRoleMiddleware()],
  controller: updateUserPassword,
});

/**@description get user by id  */
registrar.get('/:id', {
  requestSchema: { paramsSchema: { id: idValidation } },
  middleware: [authRoleMiddleware()],
  controller: getUserById,
});

/**@description update user by id  */
registrar.put('/:id', {
  requestSchema: {
    paramsSchema: { id: idValidation },
    bodySchema: userUpdateSchema,
  },
  responseSchemas: [{ statusCode: 200, schema: userSchema }],
  middleware: [authRoleMiddleware()],
  controller: updateUserProfile,
});

/**@description user signout */

/**@description signout user */
registrar.post('/signout', {
  controller: signoutUser,
});

// registrar.get("/test-query", {
//   openApiDoc: testQueryDoc,
//   requestSchema: { querySchema: TestQuerySchema },
//   controller: (req, res) => {
//     res.send("test query");
//   },
// });

export default registrar;
