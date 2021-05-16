A zipper, in general, is a data structure with a hole in it. Zippers are used for traversing/manipulating data structures, and the hole corresponds to the current focus of the traversal. Typically there is also an element of the data structure under consideration, so that one has a (list) zipper and a list or a (tree) zipper and a tree. The zipper allows the programmer to efficiently move around the data structure, even replacing the element at the focus. The pair of the zipper and the element in the focus satisfy the constraint that placing the element at the focus in the hole gives the original data structure.

Zippers can be generalised to arbitrary inductive data types. The concept can be defined in type-indexed fashion (See type-indexed data types). They are also related to the idea of the derivative of a data structure, and has been studied from a Category Theoretic perspective.