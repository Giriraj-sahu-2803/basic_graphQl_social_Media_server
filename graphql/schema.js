const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type Sample{
    statement:String!
}

type TestData{
  text:Sample!
  views:Int!
}

type AuthData{
    token:String!
    userdId:String!
}


type Post{
    _id:ID!
    title:String!
    content:String!
    imageUrl:String!
    creator:User!
    createdAt:String!
    updatedAt:String!
}

type User{
    _id:ID!
    name:String!
    email:String!
    password:String!
    status:String!
    posts:[Post!]!
}

input UserInputData{
 email:String!
 name:String!
 password:String!

}
input PostInput{
    title:String!
    content:String!
    imageUrl:String!
}

type PostData{
    posts:[Post!]!
    totalPosts:Int!
}

type RootQuery{
    hello:TestData
    login(email:String!,password:String!):AuthData!
    posts(page:Int!):PostData!
}
type RootMutation {
    createUser(userInput: UserInputData) : User!
    createPost(postInput:PostInput):Post!
}

schema {
  query :RootQuery
  mutation:RootMutation
 }

`);
