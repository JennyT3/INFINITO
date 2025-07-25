import { fetcher } from './fetcher';

export interface ContributionPayload {
  type: string;
  weight: number;
  photos: string[];
  location: string;
  notes?: string;
}

export async function createContribution(data: ContributionPayload) {
  return fetcher<{ code: string; id: string }>('/api/contributions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getContributionByCode(code: string) {
  return fetcher(`/api/contributions/${code}`);
}

export async function updateContributionStatus(id: string, status: string, notes?: string) {
  return fetcher(`/api/contributions/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
}

async function updateContributionStatusWrapper(id: string, status: string, notes?: string) {
  await updateContributionStatus(id, status, notes);
}

export async function aprobarContribucion(contributionId: string) {
  return updateContributionStatus(contributionId, 'Certificado', 'Aprobado por admin');
}