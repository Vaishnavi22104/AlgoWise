import { defineCode, type Implementations } from "@/core/algorithm/languages";

export const languages: Implementations = {
  java: defineCode(`static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();                       //@stack
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');   //@pairs
    for (char ch : s.toCharArray()) {                                  //@loop
        if (pairs.containsKey(ch)) {                                   //@is-closing
            if (stack.isEmpty() || !stack.pop().equals(pairs.get(ch))) {   //@match
                return false;                                          //@fail
            }
        } else {
            stack.push(ch);                                            //@push
        }
    }
    return stack.isEmpty();                                            //@final
}`),
  python: defineCode(`def is_valid(s):
    stack = []                                      #@stack
    pairs = {')': '(', ']': '[', '}': '{'}          #@pairs
    for ch in s:                                    #@loop
        if ch in pairs:                             #@is-closing
            if not stack or stack.pop() != pairs[ch]:   #@match
                return False                        #@fail
        else:
            stack.append(ch)                        #@push
    return len(stack) == 0                          #@final`),
};
