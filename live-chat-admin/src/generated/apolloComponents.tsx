import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as React from 'react';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};

export type Available = {
   __typename?: 'Available',
  online?: Maybe<Scalars['Boolean']>,
  time?: Maybe<Scalars['DateTime']>,
};

export type ChangePasswordInputType = {
  token: Scalars['String'],
  password: Scalars['String'],
};

export type Channel = {
   __typename?: 'Channel',
  id: Scalars['ID'],
  name: Scalars['String'],
  users?: Maybe<Array<Scalars['String']>>,
};


export type FilesType = {
   __typename?: 'FilesType',
  files: Array<Scalars['String']>,
};

export type Guest = {
   __typename?: 'Guest',
  id: Scalars['ID'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  channelId: Scalars['String'],
  email: Scalars['String'],
  avatar?: Maybe<Scalars['String']>,
  name: Scalars['String'],
  token?: Maybe<Scalars['String']>,
  count?: Maybe<Scalars['Float']>,
  channel: Channel,
};

export type GuestInputType = {
  email: Scalars['String'],
  firstname?: Maybe<Scalars['String']>,
  lastname?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
};

export type Message = {
   __typename?: 'Message',
  id: Scalars['ID'],
  message: Scalars['String'],
  userId: Scalars['String'],
  channelId: Scalars['String'],
  date: Scalars['DateTime'],
  user?: Maybe<User>,
  channel: Channel,
};

export type MessageInputType = {
  text: Scalars['String'],
  channelId: Scalars['String'],
  userId: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  fileUpload: Scalars['Boolean'],
  changePassword?: Maybe<User>,
  forgotPassword: Scalars['Boolean'],
  invalidateTokens: Scalars['Boolean'],
  register: User,
  login?: Maybe<User>,
  setAvailable: Scalars['Boolean'],
  setUnavailable: Scalars['Boolean'],
  logout: Scalars['Boolean'],
  confirmUser: Scalars['Boolean'],
  createChannel: Channel,
  sendMessage: Message,
  registerGuestOrLogin: Guest,
};


export type MutationFileUploadArgs = {
  file: Scalars['Upload']
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInputType
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']
};


export type MutationRegisterArgs = {
  userData: UserInputType
};


export type MutationLoginArgs = {
  loginData: UserLoginInput
};


export type MutationConfirmUserArgs = {
  token: Scalars['String']
};


export type MutationCreateChannelArgs = {
  name: Scalars['String']
};


export type MutationSendMessageArgs = {
  messageInput: MessageInputType
};


export type MutationRegisterGuestOrLoginArgs = {
  guestInputType: GuestInputType
};

export type Notification = {
   __typename?: 'Notification',
  /** This is the Channel ID */
  id: Scalars['ID'],
  message: Scalars['String'],
  date: Scalars['DateTime'],
  user?: Maybe<User>,
};

export type Query = {
   __typename?: 'Query',
  files: Array<Scalars['String']>,
  test: Scalars['String'],
  me?: Maybe<User>,
  AmIAuthorized?: Maybe<Scalars['Boolean']>,
  getAllUsers: Array<User>,
  getAllChannels: Array<Channel>,
  getAllMessages: Array<Message>,
  getAllGuests: Array<Guest>,
  guestMe?: Maybe<Guest>,
};

export type Subscription = {
   __typename?: 'Subscription',
  newChannelNotification: Notification,
  newMessageNotification: Notification,
  channelMessageNotification: Notification,
};


export type SubscriptionChannelMessageNotificationArgs = {
  channelId: Scalars['ID']
};


export type UploadType = {
   __typename?: 'UploadType',
  stream: Scalars['Boolean'],
  createReadStream: Scalars['Boolean'],
  filename: Scalars['String'],
  mimetype: Scalars['String'],
  encoding: Scalars['String'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  admin?: Maybe<Scalars['Boolean']>,
  channels?: Maybe<Array<Scalars['String']>>,
  available: Available,
  chatsCount?: Maybe<Scalars['Float']>,
  avatar?: Maybe<Scalars['String']>,
  maxChatsAtATime?: Maybe<Scalars['Float']>,
  isAvailable: Scalars['Boolean'],
  email: Scalars['String'],
  count?: Maybe<Scalars['Float']>,
  token?: Maybe<Scalars['String']>,
  confirmed: Scalars['Boolean'],
  name: Scalars['String'],
};

export type UserInputType = {
  email: Scalars['String'],
  password: Scalars['String'],
  firstname?: Maybe<Scalars['String']>,
  lastname?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
};

export type UserLoginInput = {
  email: Scalars['String'],
  password: Scalars['String'],
};

export type SendMessageMutaionMutationVariables = {
  text: Scalars['String'],
  channelId: Scalars['String'],
  userId: Scalars['String']
};


export type SendMessageMutaionMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'message' | 'userId' | 'channelId'>
    & { user: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'avatar' | 'email'>
    )> }
  ) }
);

export type NewMessageSubscriptionSubscriptionVariables = {};


export type NewMessageSubscriptionSubscription = (
  { __typename?: 'Subscription' }
  & { newMessageNotification: (
    { __typename?: 'Notification' }
    & Pick<Notification, 'id' | 'message' | 'date'>
    & { user: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'avatar' | 'email'>
    )> }
  ) }
);

export type LoginMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'firstName' | 'lastName' | 'name' | 'id'>
  )> }
);

export type LogoutMutationMutationVariables = {};


export type LogoutMutationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>
};


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'email' | 'id'>
  ) }
);

export type AmIAuthorizedQueryVariables = {};


export type AmIAuthorizedQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'AmIAuthorized'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'lastName' | 'firstName' | 'confirmed' | 'id' | 'name'>
  )> }
);


export const SendMessageMutaionDocument = gql`
    mutation SendMessageMutaion($text: String!, $channelId: String!, $userId: String!) {
  sendMessage(messageInput: {text: $text, channelId: $channelId, userId: $userId}) {
    id
    message
    userId
    channelId
    user {
      id
      name
      avatar
      email
    }
  }
}
    `;
export type SendMessageMutaionMutationFn = ApolloReactCommon.MutationFunction<SendMessageMutaionMutation, SendMessageMutaionMutationVariables>;
export type SendMessageMutaionComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SendMessageMutaionMutation, SendMessageMutaionMutationVariables>, 'mutation'>;

    export const SendMessageMutaionComponent = (props: SendMessageMutaionComponentProps) => (
      <ApolloReactComponents.Mutation<SendMessageMutaionMutation, SendMessageMutaionMutationVariables> mutation={SendMessageMutaionDocument} {...props} />
    );
    
export type SendMessageMutaionProps<TChildProps = {}> = ApolloReactHoc.MutateProps<SendMessageMutaionMutation, SendMessageMutaionMutationVariables> & TChildProps;
export function withSendMessageMutaion<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  SendMessageMutaionMutation,
  SendMessageMutaionMutationVariables,
  SendMessageMutaionProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, SendMessageMutaionMutation, SendMessageMutaionMutationVariables, SendMessageMutaionProps<TChildProps>>(SendMessageMutaionDocument, {
      alias: 'sendMessageMutaion',
      ...operationOptions
    });
};

    export function useSendMessageMutaionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SendMessageMutaionMutation, SendMessageMutaionMutationVariables>) {
      return ApolloReactHooks.useMutation<SendMessageMutaionMutation, SendMessageMutaionMutationVariables>(SendMessageMutaionDocument, baseOptions);
    }
export type SendMessageMutaionMutationHookResult = ReturnType<typeof useSendMessageMutaionMutation>;
export type SendMessageMutaionMutationResult = ApolloReactCommon.MutationResult<SendMessageMutaionMutation>;
export type SendMessageMutaionMutationOptions = ApolloReactCommon.BaseMutationOptions<SendMessageMutaionMutation, SendMessageMutaionMutationVariables>;
export const NewMessageSubscriptionDocument = gql`
    subscription NewMessageSubscription {
  newMessageNotification {
    id
    message
    date
    user {
      id
      name
      avatar
      email
    }
  }
}
    `;
export type NewMessageSubscriptionComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables>, 'subscription'>;

    export const NewMessageSubscriptionComponent = (props: NewMessageSubscriptionComponentProps) => (
      <ApolloReactComponents.Subscription<NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables> subscription={NewMessageSubscriptionDocument} {...props} />
    );
    
export type NewMessageSubscriptionProps<TChildProps = {}> = ApolloReactHoc.DataProps<NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables> & TChildProps;
export function withNewMessageSubscription<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  NewMessageSubscriptionSubscription,
  NewMessageSubscriptionSubscriptionVariables,
  NewMessageSubscriptionProps<TChildProps>>) {
    return ApolloReactHoc.withSubscription<TProps, NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables, NewMessageSubscriptionProps<TChildProps>>(NewMessageSubscriptionDocument, {
      alias: 'newMessageSubscription',
      ...operationOptions
    });
};

    export function useNewMessageSubscriptionSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables>) {
      return ApolloReactHooks.useSubscription<NewMessageSubscriptionSubscription, NewMessageSubscriptionSubscriptionVariables>(NewMessageSubscriptionDocument, baseOptions);
    }
export type NewMessageSubscriptionSubscriptionHookResult = ReturnType<typeof useNewMessageSubscriptionSubscription>;
export type NewMessageSubscriptionSubscriptionResult = ApolloReactCommon.SubscriptionResult<NewMessageSubscriptionSubscription>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(loginData: {email: $email, password: $password}) {
    email
    firstName
    lastName
    name
    id
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;
export type LoginComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LoginMutation, LoginMutationVariables>, 'mutation'>;

    export const LoginComponent = (props: LoginComponentProps) => (
      <ApolloReactComponents.Mutation<LoginMutation, LoginMutationVariables> mutation={LoginDocument} {...props} />
    );
    
export type LoginProps<TChildProps = {}> = ApolloReactHoc.MutateProps<LoginMutation, LoginMutationVariables> & TChildProps;
export function withLogin<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  LoginMutation,
  LoginMutationVariables,
  LoginProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, LoginMutation, LoginMutationVariables, LoginProps<TChildProps>>(LoginDocument, {
      alias: 'login',
      ...operationOptions
    });
};

    export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
      return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
    }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutMutationDocument = gql`
    mutation LogoutMutation {
  logout
}
    `;
export type LogoutMutationMutationFn = ApolloReactCommon.MutationFunction<LogoutMutationMutation, LogoutMutationMutationVariables>;
export type LogoutMutationComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LogoutMutationMutation, LogoutMutationMutationVariables>, 'mutation'>;

    export const LogoutMutationComponent = (props: LogoutMutationComponentProps) => (
      <ApolloReactComponents.Mutation<LogoutMutationMutation, LogoutMutationMutationVariables> mutation={LogoutMutationDocument} {...props} />
    );
    
export type LogoutMutationProps<TChildProps = {}> = ApolloReactHoc.MutateProps<LogoutMutationMutation, LogoutMutationMutationVariables> & TChildProps;
export function withLogoutMutation<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  LogoutMutationMutation,
  LogoutMutationMutationVariables,
  LogoutMutationProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, LogoutMutationMutation, LogoutMutationMutationVariables, LogoutMutationProps<TChildProps>>(LogoutMutationDocument, {
      alias: 'logoutMutation',
      ...operationOptions
    });
};

    export function useLogoutMutationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutationMutation, LogoutMutationMutationVariables>) {
      return ApolloReactHooks.useMutation<LogoutMutationMutation, LogoutMutationMutationVariables>(LogoutMutationDocument, baseOptions);
    }
export type LogoutMutationMutationHookResult = ReturnType<typeof useLogoutMutationMutation>;
export type LogoutMutationMutationResult = ApolloReactCommon.MutationResult<LogoutMutationMutation>;
export type LogoutMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutationMutation, LogoutMutationMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
  register(userData: {email: $email, password: $password, firstname: $firstName, lastname: $lastName}) {
    email
    id
  }
}
    `;
export type RegisterMutationFn = ApolloReactCommon.MutationFunction<RegisterMutation, RegisterMutationVariables>;
export type RegisterComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<RegisterMutation, RegisterMutationVariables>, 'mutation'>;

    export const RegisterComponent = (props: RegisterComponentProps) => (
      <ApolloReactComponents.Mutation<RegisterMutation, RegisterMutationVariables> mutation={RegisterDocument} {...props} />
    );
    
export type RegisterProps<TChildProps = {}> = ApolloReactHoc.MutateProps<RegisterMutation, RegisterMutationVariables> & TChildProps;
export function withRegister<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  RegisterMutation,
  RegisterMutationVariables,
  RegisterProps<TChildProps>>) {
    return ApolloReactHoc.withMutation<TProps, RegisterMutation, RegisterMutationVariables, RegisterProps<TChildProps>>(RegisterDocument, {
      alias: 'register',
      ...operationOptions
    });
};

    export function useRegisterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
      return ApolloReactHooks.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
    }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = ApolloReactCommon.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = ApolloReactCommon.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const AmIAuthorizedDocument = gql`
    query amIAuthorized {
  AmIAuthorized
}
    `;
export type AmIAuthorizedComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>, 'query'>;

    export const AmIAuthorizedComponent = (props: AmIAuthorizedComponentProps) => (
      <ApolloReactComponents.Query<AmIAuthorizedQuery, AmIAuthorizedQueryVariables> query={AmIAuthorizedDocument} {...props} />
    );
    
export type AmIAuthorizedProps<TChildProps = {}> = ApolloReactHoc.DataProps<AmIAuthorizedQuery, AmIAuthorizedQueryVariables> & TChildProps;
export function withAmIAuthorized<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  AmIAuthorizedQuery,
  AmIAuthorizedQueryVariables,
  AmIAuthorizedProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, AmIAuthorizedQuery, AmIAuthorizedQueryVariables, AmIAuthorizedProps<TChildProps>>(AmIAuthorizedDocument, {
      alias: 'amIAuthorized',
      ...operationOptions
    });
};

    export function useAmIAuthorizedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>) {
      return ApolloReactHooks.useQuery<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>(AmIAuthorizedDocument, baseOptions);
    }
      export function useAmIAuthorizedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>(AmIAuthorizedDocument, baseOptions);
      }
      
export type AmIAuthorizedQueryHookResult = ReturnType<typeof useAmIAuthorizedQuery>;
export type AmIAuthorizedQueryResult = ApolloReactCommon.QueryResult<AmIAuthorizedQuery, AmIAuthorizedQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    email
    lastName
    firstName
    confirmed
    id
    name
  }
}
    `;
export type MeComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<MeQuery, MeQueryVariables>, 'query'>;

    export const MeComponent = (props: MeComponentProps) => (
      <ApolloReactComponents.Query<MeQuery, MeQueryVariables> query={MeDocument} {...props} />
    );
    
export type MeProps<TChildProps = {}> = ApolloReactHoc.DataProps<MeQuery, MeQueryVariables> & TChildProps;
export function withMe<TProps, TChildProps = {}>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  MeQuery,
  MeQueryVariables,
  MeProps<TChildProps>>) {
    return ApolloReactHoc.withQuery<TProps, MeQuery, MeQueryVariables, MeProps<TChildProps>>(MeDocument, {
      alias: 'me',
      ...operationOptions
    });
};

    export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
      return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
    }
      export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
      
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;