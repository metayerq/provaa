
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface GroupBreadcrumbProps {
  groupBy: string;
}

const GroupBreadcrumb = ({ groupBy }: GroupBreadcrumbProps) => {
  const getGroupLabel = (group: string) => {
    switch (group) {
      case 'city':
        return 'Cities';
      case 'host':
        return 'Hosts';
      case 'venue':
        return 'Venues';
      case 'type':
        return 'Experiences';
      default:
        return 'Discover';
    }
  };

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/events">Discover</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{getGroupLabel(groupBy)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default GroupBreadcrumb;
