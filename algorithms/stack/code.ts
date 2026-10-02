import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`public static void main(String[] args) {
    Deque<Integer> stack = new ArrayDeque<>();   //@create
    stack.push(10);                              //@push-1
    stack.push(20);                              //@push-2
    stack.push(30);                              //@push-3
    int top = stack.peek();                      //@peek
    stack.pop();                                 //@pop-1
    stack.push(40);                              //@push-4
    stack.pop();                                 //@pop-2
    stack.pop();                                 //@pop-3
}`),
  python: defineCode(`stack = []                  #@create
stack.append(10)            #@push-1
stack.append(20)            #@push-2
stack.append(30)            #@push-3
top = stack[-1]             #@peek
stack.pop()                 #@pop-1
stack.append(40)            #@push-4
stack.pop()                 #@pop-2
stack.pop()                 #@pop-3`),
};
