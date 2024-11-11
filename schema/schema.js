const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');
const Employee = require('../models/employee');

// Employee Type
const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        class: { type: GraphQLString },
        subjects: { type: new GraphQLList(GraphQLString) },
        attendance: { type: GraphQLInt }
    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        employee: {
            type: EmployeeType,
            args: { id: { type: GraphQLString } },
            resolve(parent, args) {
                return Employee.findById(args.id);
            }
        },
        employees1: {
            type: new GraphQLList(EmployeeType),
            args: {
              name: { type: GraphQLString }
            },
            resolve(parent, args) {
              return Employee.find(args.name ? { name: args.name } : {});
            }
          },
          
        employees2: {
            type: new GraphQLList(EmployeeType),
            args: {
                page: { type: GraphQLInt },
                limit: { type: GraphQLInt },
                sortField: { type: GraphQLString },
                sortOrder: { type: GraphQLString }
            },
            resolve(parent, args) {
                const { page = 1, limit = 10, sortField = 'name', sortOrder = 'asc' } = args;
                const skip = (page - 1) * limit;
                const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
                return Employee.find().skip(skip).limit(limit).sort(sort);
            }
        }
        
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addEmployee: {
            type: EmployeeType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                class: { type: new GraphQLNonNull(GraphQLString) },
                subjects: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
                attendance: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let employee = new Employee({
                    name: args.name,
                    age: args.age,
                    class: args.class,
                    subjects: args.subjects,
                    attendance: args.attendance
                });
                return employee.save();
            }
        },
        updateEmployee: {
            type: EmployeeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                class: { type: GraphQLString },
                subjects: { type: new GraphQLList(GraphQLString) },
                attendance: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Employee.findByIdAndUpdate(args.id, {
                    name: args.name,
                    age: args.age,
                    class: args.class,
                    subjects: args.subjects,
                    attendance: args.attendance
                }, { new: true });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
