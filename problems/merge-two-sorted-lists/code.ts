import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`static ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode();        //@dummy
    ListNode tail = dummy;                  //@tail
    while (l1 != null && l2 != null) {      //@loop
        if (l1.val <= l2.val) {             //@compare
            tail.next = l1;                 //@take-l1
            l1 = l1.next;                   //@advance-l1
        } else {
            tail.next = l2;                 //@take-l2
            l2 = l2.next;                   //@advance-l2
        }
        tail = tail.next;                   //@tail-next
    }
    tail.next = (l1 != null) ? l1 : l2;     //@remainder
    return dummy.next;                      //@return
}`),
  python: defineCode(`def merge_two_lists(l1, l2):
    dummy = ListNode()          #@dummy
    tail = dummy                #@tail
    while l1 and l2:            #@loop
        if l1.val <= l2.val:    #@compare
            tail.next = l1      #@take-l1
            l1 = l1.next        #@advance-l1
        else:
            tail.next = l2      #@take-l2
            l2 = l2.next        #@advance-l2
        tail = tail.next        #@tail-next
    tail.next = l1 or l2        #@remainder
    return dummy.next           #@return`),
};
