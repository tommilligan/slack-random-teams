
export const formatTeams = (teams) => {
  // Push data into an array of lines
  var lines = [];
  lines.push('_Your teams are:_');
  teams.forEach(([teamName, memberNames]) => {
    lines.push(`*${teamName}*`);
    memberNames.forEach(memberName => {
      lines.push(memberName);
    });
  });
  return lines.join('\n');
};
