import { publish } from 'gh-pages';

publish(
 'public', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/FMeister/SpiceSpace.git', // Update to point to your repository
  user: {
   name: 'FMeister', // update to use your name
   email: 'fabian-meister@gmx.de' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);