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
    post(id:ID!):Post!
    user:User!
}
type RootMutation {
    createUser(userInput: UserInputData) : User!
    createPost(postInput:PostInput):Post!
    updatePost(id:ID!,postInput:PostInput):Post!
    deletePost(id:ID!):Boolean!
    updateStatus(status:String):User!
}

schema {
  query :RootQuery
  mutation:RootMutation
 }

`);
