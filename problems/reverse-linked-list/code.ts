import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`static ListNode reverseList(ListNode head) {
    ListNode prev = null;           //@prev
    ListNode curr = head;           //@curr
    while (curr != null) {          //@loop
        ListNode nxt = curr.next;   //@save-next
        curr.next = prev;           //@flip
        prev = curr;                //@move-prev
        curr = nxt;                 //@move-curr
    }
    return prev;                    //@return
}`),
  python: defineCode(`def reverse_list(head):
    prev = None             #@prev
    curr = head             #@curr
    while curr:             #@loop
        nxt = curr.next     #@save-next
        curr.next = prev    #@flip
        prev = curr         #@move-prev
        curr = nxt          #@move-curr
    return prev             #@return`),
};
