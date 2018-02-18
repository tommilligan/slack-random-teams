import { shuffle, chunkArray } from './utils';

/**
 * The text command should be a space delimited list of teamnames
 * @param {String} text 
 */
export const parseCommandText = text => {
  return text.trim().split(/\s+/);
};

/**
 * Given an array of labels an an array of members, return an array
 * of (label: any, members: any[]) pairs. Members will be randomly
 * assigned to a label in equal quantities.
 * @param {any[]} labels 
 * @param {any[]} members 
 */
export const randomlyAssign = (labels, members) => {
  labels = shuffle(labels);
  const chunkedMembers = chunkArray(members, labels.length);
  const assignments = labels.map((label, i) => {
    return [label, chunkedMembers[i]];
  });
  return assignments;
};
