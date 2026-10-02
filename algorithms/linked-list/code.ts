import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`class Node {
    int val;
    Node next;
    Node(int val) { this.val = val; }
}

public static void main(String[] args) {
    Node head = new Node(10);                 //@build-0
    head.next = new Node(20);                 //@build-1
    head.next.next = new Node(30);            //@build-2
    head.next.next.next = new Node(40);       //@build-3

    Node curr = head;                         //@curr
    while (curr != null) {                    //@loop
        System.out.println(curr.val);         //@visit
        curr = curr.next;                     //@advance
    }
}`),
  python: defineCode(`class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

head = Node(10)                     #@build-0
head.next = Node(20)                #@build-1
head.next.next = Node(30)           #@build-2
head.next.next.next = Node(40)      #@build-3

curr = head                         #@curr
while curr:                         #@loop
    print(curr.val)                 #@visit
    curr = curr.next                #@advance`),
};
