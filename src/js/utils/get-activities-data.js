import { LOCAL_STORAGE_ACTIVITIES_KEY } from './constants';

export function getActivitiesData() {
  return /** @type {Array<import('../../components/life-balancer/activity-type').ActivityType>} */ (
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY) || '[]')
  );
}
