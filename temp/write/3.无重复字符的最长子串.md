/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  // 滑动窗口
  // 1、右侧指针移位
  // 2、判断是否符合
  // 3、左侧指针是否需要移位
  // 4、进入下一次循环
  if (s.length <= 1) {
    return s.length
  }
  let left = 0
  let right = 1
  let max = 0
  let temp
  while (right < s.length) {
    temp = s.slice(left, right)
    if (temp.indexOf(s.charAt(right)) > -1) {
      left++
      continue
    } else {
      right++
    }
    if (1) {
    }
  }
}
// @lc code=end
